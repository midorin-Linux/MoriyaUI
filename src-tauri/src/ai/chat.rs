use crate::models::store::{Store, Message};

use std::io::Write;
use async_openai::{
    Client,
    config::OpenAIConfig,
    types::chat::{
        ChatCompletionRequestSystemMessage, ChatCompletionRequestUserMessage,
        CreateChatCompletionRequestArgs,
    },
};

const API_BASE: &str = "http://localhost:1234/v1";
const MODEL_NAME: &str = "unsloth/gpt-oss-20b";
const SYSTEM_PROMPT: &str = "You are a helpful assistant.";
const MAX_TOKENS: u16 = 8192;

#[tauri::command(rename_all = "camelCase")]
pub async fn chat(chat_conversation_uuid: String, user_prompt: String) -> Result<String, String> {
    let chat_conversation_json_path = format!("conversations/{}.json", chat_conversation_uuid);
    let chat_conversation_json = std::fs::read_to_string(&chat_conversation_json_path)
        .map_err(|e| e.to_string())?;

    let mut chat_conversation: Store = serde_json::from_str(&chat_conversation_json)
        .map_err(|e| e.to_string())?;
    chat_conversation.messages.push(Message { role: "system".to_string(), content: SYSTEM_PROMPT.to_string()});
    chat_conversation.messages.push(Message { role: "user".to_string(), content: user_prompt.clone()});

    let client = Client::with_config(
        OpenAIConfig::new()
            .with_api_base(API_BASE)
            .with_api_key(std::env::var("OPENAI_API_KEY").unwrap_or_else(|_| "suwako".to_string()))
    );

    let request = CreateChatCompletionRequestArgs::default()
        .max_tokens(MAX_TOKENS)
        .model(MODEL_NAME)
        .store(true)
        .messages([
            ChatCompletionRequestSystemMessage::from(SYSTEM_PROMPT).into(),
            ChatCompletionRequestUserMessage::from(user_prompt).into(),
        ])
        .build()
        .map_err(|e| e.to_string())?;

    println!(
        "{}",
        serde_json::to_string(&request).unwrap_or_else(|_| "Failed to serialize request json".to_string())
    );

    let response = client
        .chat()
        .create(request)
        .await
        .map_err(|e| format!("API request failed: {}", e))?;

    let assistant_content = response.choices.into_iter().next()
        .and_then(|choice| choice.message.content)
        .ok_or_else(|| "Failed to get assistant message content".to_string())?;

    chat_conversation.messages.push(Message { role: "assistant".to_string(), content: assistant_content.clone()});

    let mut file = std::fs::File::create(chat_conversation_json_path).map_err(|e| e.to_string())?;
    file.write_all(serde_json::to_string(&chat_conversation).map_err(|e| e.to_string())?.as_bytes()).map_err(|e| e.to_string())?;

    Ok(assistant_content)
}
