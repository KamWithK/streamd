mod room;

use room::{on_join_room, on_join_web_socket, create_room};

use warp::Filter;

#[tokio::main]
async fn main() {
    let files = warp::path("static").and(warp::fs::dir("static"));
    let room = warp::path("room")
        .and(warp::path::param::<String>())
        .and_then(on_join_room);
    let socket = warp::path("socket")
        .and(warp::path::param::<String>())
        .and(warp::ws())
        .map(|room_id: String, ws: warp::ws::Ws| {
            ws.on_upgrade(move |socket| on_join_web_socket(room_id, socket))
        });

    let route = files.or(room).or(socket);

    println!("room id: {}", create_room().await);

    warp::serve(route).run(([127, 0, 0, 1], 3030)).await;
}