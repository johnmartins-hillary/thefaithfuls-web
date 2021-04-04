export interface SnippetBroadcast {
  publishedAt?: Date;
  channelId?: string;
  thumbnails?: {
    [key in "default" | "medium" | "high"| "high" | "standard" | "maxres"]: {
      url: string;
      width: number;
      height: number;
    };
  };
  title: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  description: string;
  liveChatId?: string;
  broadCastUrl?: string;
}

export interface StatusBroadcast {
  lifeCycleStatus?:
    | "complete"
    | "created"
    | "live"
    | "liveStarting"
    | "ready"
    | "revoked"
    | "testStarting"
    | "testing";
  privacyStatus: "private" | "public" | "unlisted";
  recordingStatus?: "notRecording" | "recorded" | "recording";
  madeForKids?: boolean;
  selfDeclarendMadeForKids?: boolean;
};

export interface ContentDetailBroadcast {
  boundStreamId?: string;
  boundStreamLastUpdateTimeMs?: Date;
  monitorStream: {
    enableMonitorStream: boolean;
    broadcastStreamDelayMs?: number;
    embedHtml?: string;
  };
  enableEmbed?: boolean;
  enableDvr?: boolean;
  enableContentEncryption?: boolean;
  startWithSlate?: boolean;
  recordFromStart?: boolean;
  closedCaptionsType?:
    | "closedCaptionsDisabled"
    | "closedCaptionsHttpPost"
    | "closedCaptionsEmbedded";
  projection?: "360" | "rectangular";
  isReusable?: boolean;
  enableLowLatency?: boolean;
  latencyPreference?: "normal" | "low" | "ultralow";
  enableAutoStart?: boolean;
  enableAutoStop?: boolean;
  statistics?: {
    totalChatCount: number;
  };
}

export interface LiveBroadcast {
  kind: string;
  etag: string;
  id: string;
  broadcastId: string;
  streamId: string;
  part?: string[];
  snippet: SnippetBroadcast;
  status: StatusBroadcast
  contentDetails: ContentDetailBroadcast
  churchId: number;
  eventId:number
  broadcastStatus: string;
}

export interface CdnStream {
  ingestionType: "dash" | "hls" | "rtmp";
  ingestionInfo?: {
    streamName: string;
    ingestionAddress: string;
    backupIngestionAddress: string;
    rtmpsIngestionAddress: string;
    rtmpsBackupIngestionAddress: string;
  };
  resolution:
    | "240p"
    | "360p"
    | "480p"
    | "1080p"
    | "1440p"
    | "2160p"
    | "variable";
  frameRate: "30fps" | "60fps" | "variable";
}
export interface StatusStream {
  streamStatus: "active" | "created" | "error" | "inactive" | "ready";
  healthStatus?: {
    status: "good" | "ok" | "bad" | "noData";
    lastUpdateTimeSeconds: string;
    configurationIssues: {
      type: string;
      severity: "info" | "warning" | "error";
      reason: string;
      description: string;
    }[];
  };
}
export interface SnippetStream {
  title: string;
  publishedAt?: Date;
  channelId?: string;
  description?: string;
}
export interface ContentDetailStream {
  closedCaptionsIngestionUrl?: string;
  isReusable?: boolean;
}

export interface ILiveStream {
  kind: string;
  stag: string;
  id: string;
  snippet: SnippetStream;
  cdn: CdnStream;
  status: StatusStream;
  contentDetails: ContentDetailStream;
}

interface StreamChurch {
  liveStreamID: string;
  frameRate: "60fps" | "80fps";
  ingestionType: "rtmp";
  resolution: "480p" | "1080p";
  isReusable: boolean;
  title: string;
  description: string;
  churchId: string;
  ingestionAddress: string;
  rtmpingestionAddress: string;
  ingestionBackupAddress: string;
  streamName: string;
};

export interface LiveStreamChurchResponse {
  liveBroadcastID: string;
  liveStreamID: string;
  title: string;
  description: string;
  url: null | string;
  liveChatId: string;
  channelId: null | string;
  publishedOn: Date | string;
  scheduledStartTime: Date | string;
  scheduledEndTime: Date | string;
  privacyStatus: string;
  status: "Upcoming" | "IsLive" | "Passed";
  churchId: number;
  eventId:number;
  liveStream: StreamChurch
}
