use std::io::Write;
use crate::models::store::Store;

#[tauri::command(rename_all = "camelCase")]
pub async fn create_new_chat_conversation() -> Result<Store, String> {
    std::fs::create_dir_all("conversations").map_err(|e| e.to_string())?;

    loop {
        let chat_id = uuid::Uuid::new_v4().to_string();
        let path = format!("conversations/{}.json", chat_id);
        if !std::path::Path::new(&path).exists() {
            let property = Store {
                chat_id: chat_id.clone(),
                title: "新規チャット".to_string(),
                created_at: chrono::Utc::now(),
                updated_at: chrono::Utc::now(),
                messages: vec![],
            };

            let json = serde_json::to_string_pretty(&property).map_err(|e| e.to_string())?;
            
            let mut file = std::fs::File::create(&path).map_err(|e| e.to_string())?;
            file.write_all(json.as_bytes()).map_err(|e| e.to_string())?;

            return Ok(property);
        }
    }
}