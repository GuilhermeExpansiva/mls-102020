/// <mls fileReference="_102020_/l2/agentMaterializeSolution/agentMaterializePlan.ts" enhancement="_102027_/l2/enhancementAgent"/>

declare const mls: any;

// Pipeline item types — explicit names, one per L1 layer and per L2 output file.
export type PipelineItemType =
  | 'layer_1_external'      // L1: physical table — no dependencies
  | 'layer_4_entities'      // L1: entity contract — depends on layer_1_external
  | 'layer_3_usecases'      // L1: use case — depends on layer_4_entities
  | 'layer_2_controllers'   // L1: controller — depends on layer_3_usecases
  | 'l2_page'               // L2: page component (one of 3 from a page .defs.ts)
  | 'l2_shared'             // L2: page shared/helpers (one of 3)
  | 'l2_contract'           // L2: page data contract (one of 3)
  | 'l2_layer2contracts';   // L2: module-level layer_2_contracts file

// Source file classification used during the scan phase.
// l2_page expands to 3 PipelineItems (l2_page + l2_shared + l2_contract) in assembly.
export type ScannedDefType =
  | 'layer_1_external'
  | 'layer_4_entities'
  | 'layer_3_usecases'
  | 'layer_2_controllers'
  | 'l2_page'
  | 'l2_layer2contracts';

export interface PipelineItem {
  id: string;
  type: PipelineItemType;
  layer: 'l1' | 'l2';
  moduleName: string;
  defPath: string;       // source .defs.ts path — e.g. "102043/l1/cafeFlow/layer_1_external/order.defs.ts"
  outputPath: string;    // target .ts path to generate
  dependsFiles: string[]; // defPaths the agent must read as context
  dependsOn: string[];   // ids of pipeline items that must complete first
  agent: 'agentMaterializeDef';
}

export interface ProjectModuleRef {
  moduleName: string;
}

export interface ProjectJson {
  projectId?: string;
  modules: ProjectModuleRef[];
}

export interface ScannedDefFile {
  project: number;
  level: number;
  folder: string;
  shortName: string;
  filePath: string;     // canonical string path
  moduleName: string;
  type: ScannedDefType;
  layer: 'l1' | 'l2';
}
