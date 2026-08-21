use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Deserialize)]
pub(crate) struct Truth {
    pub(crate) suite_id: String,
    pub(crate) exact_family: Value,
    pub(crate) source_digests: BTreeMap<String, String>,
    pub(crate) categories: Vec<Category>,
    pub(crate) repositories: Vec<Repository>,
    pub(crate) product_cases: Vec<TruthCase>,
    pub(crate) controller_cases: Vec<TruthCase>,
    pub(crate) promotion_requirements: Requirements,
}

#[derive(Deserialize)]
pub(crate) struct TruthCase {
    pub(crate) case_id: String,
    pub(crate) control: String,
    pub(crate) reason_code: Option<String>,
}

#[derive(Deserialize)]
pub(crate) struct Category {
    pub(crate) category: String,
    pub(crate) mapping: String,
    pub(crate) required_evidence_grade: String,
}

#[derive(Deserialize)]
pub(crate) struct Repository {
    pub(crate) repository_id: String,
    pub(crate) role: String,
}

#[derive(Deserialize)]
pub(crate) struct Requirements {
    pub(crate) minimum_held_out_applications: u64,
    pub(crate) minimum_held_out_vulnerable_categories: u64,
    pub(crate) minimum_held_out_safe_categories: u64,
    pub(crate) required_held_out_framework_families: Vec<String>,
    pub(crate) required_publication_state: String,
    pub(crate) required_coverage_verdict: String,
    pub(crate) maximum_false_positives: u64,
    pub(crate) maximum_false_negatives: u64,
}

#[derive(Clone, Deserialize)]
pub(crate) struct Evidence {
    pub(crate) schema_version: String,
    pub(crate) suite_id: String,
    pub(crate) layer: String,
    pub(crate) repository_id: String,
    pub(crate) independent_truth_digest: Option<String>,
    pub(crate) runtime_coordinate: String,
    pub(crate) framework_coordinate: String,
    pub(crate) ordinary_product_path: bool,
    pub(crate) publication_state: String,
    pub(crate) coverage_verdict: String,
    pub(crate) sealed_transcripts_verified: bool,
    pub(crate) authenticated_readback_verified: bool,
    pub(crate) failed_requests: u64,
    pub(crate) unexpected_facts: u64,
    pub(crate) unresolved_obligations: u64,
    pub(crate) observations: Vec<Observation>,
    pub(crate) evidence_digest: String,
}

#[derive(Clone, Deserialize)]
pub(crate) struct Observation {
    pub(crate) case_id: String,
    pub(crate) disposition: String,
    pub(crate) evidence_grade: String,
    pub(crate) repository_path: String,
    pub(crate) sink_identity: String,
    pub(crate) reason_code: Option<String>,
}

#[derive(Serialize)]
pub(crate) struct Report {
    pub(crate) schema_version: &'static str,
    pub(crate) suite_id: String,
    pub(crate) evidence_digest: String,
    pub(crate) evidence_envelope_closed: bool,
    pub(crate) held_out_applications_passed: bool,
    pub(crate) promotion_eligible: bool,
    pub(crate) score: Score,
    pub(crate) category_scores: Vec<CategoryScore>,
    pub(crate) reason_codes: Vec<String>,
}

#[derive(Default, Serialize)]
pub(crate) struct Score {
    pub(crate) status: String,
    pub(crate) tp: u64,
    pub(crate) fp: u64,
    #[serde(rename = "fn")]
    pub(crate) fn_count: u64,
    pub(crate) tn: u64,
    pub(crate) unknown_controls_passed: u64,
    pub(crate) unsupported_controls_passed: u64,
    pub(crate) evidence_grade_mismatches: u64,
    pub(crate) reason_code_mismatches: u64,
    pub(crate) unresolved: u64,
    pub(crate) unexpected_observations: u64,
    pub(crate) passed: bool,
}

#[derive(Serialize)]
pub(crate) struct CategoryScore {
    pub(crate) category: String,
    pub(crate) mapping: String,
    pub(crate) required_evidence_grade: String,
    pub(crate) tp: u64,
    pub(crate) fp: u64,
    #[serde(rename = "fn")]
    pub(crate) fn_count: u64,
    pub(crate) tn: u64,
    pub(crate) evidence_grade_mismatches: u64,
    pub(crate) reason_code_mismatches: u64,
    pub(crate) unresolved: u64,
    pub(crate) passed: bool,
}
