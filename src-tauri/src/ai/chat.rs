// rust
use async_openai::{
    Client,
    config::OpenAIConfig,
    traits::RequestOptionsBuilder,
    types::chat::{
        ChatCompletionRequestAssistantMessage, ChatCompletionRequestSystemMessage,
        ChatCompletionRequestUserMessage, CreateChatCompletionRequestArgs,
    },
};

const API_BASE: &str = "http://localhost:1234/v1";
const MODEL_NAME: &str = "unsloth/gpt-oss-20b";
const SYSTEM_PROMPT: &str = "You are a helpful assistant.";
const MAX_TOKENS: u16 = 8192;

#[tauri::command(rename_all = "camelCase")]
pub async fn chat(user_prompt: String) -> Result<String, String> {
    let client = Client::with_config(
        OpenAIConfig::new()
            .with_api_base(API_BASE)
            .with_api_key(std::env::var("OPENAI_API_KEY").unwrap_or_else(|_| "suwako".to_string()))
    );

    let request = CreateChatCompletionRequestArgs::default()
        .max_tokens(MAX_TOKENS)
        .model(MODEL_NAME)
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

    response.choices.into_iter().next()
        .and_then(|choice| choice.message.content)
        .ok_or_else(|| "Failed to get assistant message content".to_string())
}
