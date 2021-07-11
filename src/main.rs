use warp::Filter;

#[tokio::main]
async fn main() {
    let route = warp::path("static").and(warp::fs::dir("static"));

    warp::serve(route).run(([127, 0, 0, 1], 3030)).await;
}