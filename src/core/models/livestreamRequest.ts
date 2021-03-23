export interface SaveLiveStream {
    broadcastId: string;
    streamId: string;
    part?:string[]
    snippet :{
      title: string;
      scheduledStartTime: string;
      scheduledEndTime: string;
      description: string;
      channelId?: string;
      liveChatId?: string;
      broadCastUrl?: string
    };
    contentDetails: {
      enableClosedCaptions: true;
      enableContentEncryption: true;
      enableDvr: true;
      enableEmbed: true;
      recordFromStart: true;
      startWithSlate: true;
      isReusable: true
    };
    status: {
      privacyStatus: "private" | "public" | "unlisted"
    };
    cdn: {
      frameRate: string;
      resolution: string;
      ingestionType: string;
      ingestionAddress?: string;
      rtmpsBackupIngestionAddress?: string;
      rtmpsIngestionAddress?: string;
      streamName?: string
    };
    churchId: number;
    broadcastStatus: string
  }