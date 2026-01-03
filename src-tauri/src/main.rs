// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tokio::main(flavor = "current_thread")]
async fn main() {
    std::fs::create_dir_all("conversations").unwrap();
    moriyaui_lib::run()
}
