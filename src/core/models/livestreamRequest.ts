
export interface saveLiveStream {
    broadcastId: string;
    streamId: string;
    snippet :{
      title: string;
      scheduledStartTime: string;
      scheduledEndTime: string;
      description: string;
      channelId: string;
      liveChatId: string;
      broadCastUrl: string
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
      privacyStatus: string
    };
    cdn: {
      frameRate: string;
      ingestionType: string;
      resolution: string;
      ingestionAddress: string;
      rtmpsBackupIngestionAddress: string;
      rtmpsIngestionAddress: string;
      streamName: string
    };
    churchId: number;
    broadcastStatus: string
  }