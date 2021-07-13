#[derive(Clone, Copy, Debug)]
pub struct User {
    pub id: usize,
    pub upload_speed: f64,
    pub download_speed: f64,
    pub bottleneck_speed: f64
}

impl User {
    pub fn new(id: usize, upload_speed: f64, download_speed: f64) -> Self {
        Self {
            id,
            upload_speed,
            download_speed,
            bottleneck_speed: if upload_speed <= download_speed {upload_speed} else {download_speed}
        }
    }
}

#[derive(Clone, Copy, Debug)]
pub struct Connection {
    pub sharer_id: usize,
    pub reciever_id: usize,
    leftover_bandwith: f64
}

impl Connection {
    pub fn from_users(sharer: User, users: &mut Vec<User>) -> Vec<Connection> {
        users.sort_by(|user_one, user_two| (-1. * user_one.bottleneck_speed).partial_cmp(&user_two.bottleneck_speed).unwrap());

        let (mut queue, mut users, mut connections) = (Vec::new(), users, Vec::new());
        queue.push(sharer);

        // Note some users may not be connected
        while !users.is_empty() && !queue.is_empty() {
            Self::maximise_connections(&mut queue, &mut users, &mut connections);
        }

        connections
    }

    pub fn maximise_connections(queue: &mut Vec<User>, recievers: &mut Vec<User>, connections: &mut Vec<Self>) {
        let sharer = queue.remove(0);
        let mut reciever;
        let mut net_bandwith = 0.;

        while net_bandwith <= sharer.bottleneck_speed {
            reciever = recievers.remove(0);
            queue.push(reciever);

            net_bandwith += reciever.bottleneck_speed;
            connections.push(
                Connection {
                    sharer_id: sharer.id,
                    reciever_id: reciever.id,
                    leftover_bandwith: sharer.bottleneck_speed - net_bandwith
                }
            );
        }
    }
}
