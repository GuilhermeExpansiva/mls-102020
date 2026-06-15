/// <mls fileReference="_102020_/l2/agentMaterializeSolution/agentMaterializePlan.ts" enhancement="_blank"/>

// ─── Pipeline item — embedded in each .defs.ts as `export const pipeline` ─────

export interface PipelineItem {
  id: string;
  type: string;
  outputPath: string;   // _102043_/l1/cafeFlow/layer_4_entities/PedidoEntity.ts
  defPath: string;      // _102043_/l1/cafeFlow/layer_4_entities/pedidoEntity.defs.ts
  dependsFiles: string[]; // already-generated .ts files the executor needs as context
  dependsOn: string[];    // pipeline item IDs that must complete before this one
  agent: string;
}

// ─── L1 layer folders scanned for existing .defs.ts ──────────────────────────

export type L1LayerFolder =
  | 'layer_1_external'
  | 'layer_4_entities'
  | 'layer_3_usecases';

// ─── Scanned file descriptor ──────────────────────────────────────────────────

export interface ScannedDefsFile {
  project: number;
  level: number;
  folder: string;      // e.g. "cafeFlow/layer_4_entities"
  shortName: string;   // e.g. "pedidoEntity"
  moduleName: string;
  mlsPath: string;     // _102043_/l1/cafeFlow/layer_4_entities/pedidoEntity.defs.ts
}

// ─── Fase 2: L2 generation ────────────────────────────────────────────────────

export type L2FileType = 'contract' | 'shared' | 'page';

export interface GenStepArgs {
  planId: string;
  defPath: string;       // MLS path of the .defs.ts
  pipelineItem: PipelineItem;
  skillPaths: string[];  // already resolved
  fileType: L2FileType;
}

export interface ParsedMlsPath {
  project: number;
  level: number;
  folder: string;
  shortName: string;
  extension: string;
}

// ─── project.json ─────────────────────────────────────────────────────────────

export interface ProjectModuleRef {
  moduleName: string;
}

export interface SkillEntry {
  skillPath?: string[];
}

export interface ProjectJson {
  modules: ProjectModuleRef[];
  layouts?: Record<string, SkillEntry>;
  designSystems?: Record<string, SkillEntry>;
}
