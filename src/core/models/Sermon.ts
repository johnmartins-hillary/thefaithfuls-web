
export interface ISermon {
    sermonID?:string;
    title:string;
    author:string;
    authorDesignation:string;
    featureImage?:string;
    featureDateFrom:Date;
    featureDateTo:Date;
    sermonContent:string;
    churchId:number;
    vidaudio?:File;
    featureVidAudio?:string
}