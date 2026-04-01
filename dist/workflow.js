/**
 * Local extension workflow: extract auth credentials from captured traffic.
 */
function toolNode(id, toolName, options) {
  return {
    kind: 'tool',
    id,
    toolName,
    input: options?.input,
    retry: options?.retry,
    timeoutMs: options?.timeoutMs,
  };
}

function sequenceNode(id, steps) {
  return { kind: 'sequence', id, steps };
}

/** @type {import('../../dist/src/server/workflows/WorkflowContract.js').WorkflowContract} */
const authExtractWorkflow = {
  kind: 'workflow-contract',
  version: 1,
  id: 'workflow.auth-extract.v1',
  displayName: 'Network Auth Extractor',
  description: 'Collect requests, extract auth tokens/cookies, and export HAR.',
  tags: ['workflow', 'network', 'auth'],
  timeoutMs: 3 * 60_000,
  defaultMaxConcurrency: 1,

  build() {
    return sequenceNode('auth-extract-root', [
      toolNode('get-requests', 'network_get_requests', {
        input: {
          autoEnable: true,
          limit: 200,
        },
      }),
      toolNode('extract-auth', 'network_extract_auth', {
        input: {
          minConfidence: 0.4,
        },
      }),
      toolNode('export-har', 'network_export_har', {
        input: {
          includeBodies: false,
        },
      }),
    ]);
  },
};

export default authExtractWorkflow;
