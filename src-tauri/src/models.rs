#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct DatabaseHealth {
    pub message: String,
    pub path: String,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailItem {
    pub id: i64,
    pub label: String,
    pub address: String,
    pub provider: String,
    pub purpose: String,
    pub two_factor: bool,
    pub account_count: i64,
    pub recovery: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AccountItem {
    pub id: i64,
    pub name: String,
    pub category: String,
    pub platform: String,
    pub username: String,
    pub user_id: Option<String>,
    pub login_method: String,
    pub linked_email_id: i64,
    pub password_location: String,
    pub two_factor: bool,
    pub status: String,
    pub tags: Vec<String>,
    pub notes: String,
    pub created_at: String,
    pub updated_at: String,
}
