



class GoogleAuth  {
    private gapi;
    private discoveryDocs = [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
      ];
    private scopes = "https://www.googleapis.com/auth/calendar";
    
    constructor(private clientId:string, private apiKey:string,gapi:any){
        this.gapi = (window as any).gapi
    }

    handleAuthClick() {
        // return this.gapi.load("client:auth2",() => {
        //     this.gapi.client.init({
        //         apiKey:this.apiKey,
        //         clientId:this.clientId,
        //         discoveryDocs:
        //     })
        // })
    }
}


export default GoogleAuth