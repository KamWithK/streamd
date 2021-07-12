use lazy_static::lazy_static;
use rand::{thread_rng, Rng};
use rand::distributions::Alphanumeric;

use std::collections::HashMap;
use std::sync::{
    atomic::{AtomicUsize, Ordering},
    Arc,
};

use serde::{Deserialize, Serialize};

use futures::{FutureExt, StreamExt};
use tokio::sync::{mpsc, RwLock};
use tokio_stream::wrappers::UnboundedReceiverStream;
use warp::ws::{Message, WebSocket};
//use warp::Filter;
use std::convert::Infallible;

struct Room {
    users: Users,
    id: String,
    next_user_id: AtomicUsize
}

enum WsMessageType {
    User,
    Server
}

#[derive(Serialize, Deserialize)]
struct WsMessage {
    user: usize,
    id: u8,
    msg: serde_json::Value,
}

#[derive(Serialize, Deserialize)]
struct ServerMessage {
    sending: Vec<usize>,
    receiving: usize,
}

type Users = Arc<RwLock<HashMap<usize, mpsc::UnboundedSender<Result<Message, warp::Error>>>>>;
type Rooms = Arc<RwLock<HashMap<String, Room>>>;

lazy_static! {
    static ref ROOMS: Rooms = Rooms::default();
}

pub async fn create_room() -> String {
    loop {
        let rand_string: String = thread_rng()
            .sample_iter(&Alphanumeric)
            .take(6)
            .map(char::from)
            .collect();
        
        if !ROOMS.read().await.contains_key(&rand_string) {
            ROOMS.write().await.insert(rand_string.clone(), Room {
                users: Users::default(),
                id: rand_string.clone(),
                next_user_id: AtomicUsize::new(1)
            });
            return rand_string;
        }
    }
}

pub async fn on_join_room(room_id: String) -> Result<impl warp::Reply, Infallible> {
    if ROOMS.read().await.contains_key(&room_id) {
        Ok(warp::reply::html(""))
    } else {
        Ok(warp::reply::html(""))
    }
}

pub async fn on_join_web_socket(room_id: String, ws: WebSocket) {
    if let Some(room) = ROOMS.read().await.get(&room_id) {
        let user_id = room.next_user_id.fetch_add(1, Ordering::Relaxed);
        let (user_ws_tx, mut user_ws_rx) = ws.split();
        let (tx, rx) = mpsc::unbounded_channel();
        let rx = UnboundedReceiverStream::new(rx);
        tokio::task::spawn(rx.forward(user_ws_tx).map(|result| {
            if let Err(e) = result {
                eprintln!("websocket send error: {}", e);
            }
        }));

        room.users.write().await.insert(user_id, tx);

        while let Some(result) = user_ws_rx.next().await {
            let msg = match result {
                Ok(msg) => msg,
                Err(e) => {
                    eprintln!("websocket error(uid={}): {}", user_id, e);
                    break;
                }
            };

            if let Ok(_) = user_message(user_id, msg, &room).await {}
        }
    
        user_disconnected(user_id, &room).await;
    }
}

async fn user_message(user_id: usize, msg: Message, room: &Room) -> serde_json::Result<()>
{
    if let Ok(msg) = msg.to_str() {
        let users = room.users.read().await;

        let json: WsMessage = serde_json::from_str(msg)?;
        if json.id != WsMessageType::User as u8 {
            return Ok(());
        }

        let tx = if let Some(i) = users.get(&json.user) {
            i
        } else {
            return Ok(());
        };

        let msg = serde_json::to_string(&json.msg)?;
        if let Err(_disconnected) = tx.send(Ok(Message::text(msg))) {}
    }

    Ok(())
}

async fn user_disconnected(user_id: usize, room: &Room) {
    eprintln!("good bye user: {}", user_id);

    room.users.write().await.remove(&user_id);
}
