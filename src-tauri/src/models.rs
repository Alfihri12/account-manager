#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct DatabaseHealth {
    pub message: String,
    pub path: String,
}
