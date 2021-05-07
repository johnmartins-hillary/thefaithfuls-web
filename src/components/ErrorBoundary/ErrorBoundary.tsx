import React,{Component,ErrorInfo,ReactNode} from "react"

interface IProps {
    children:ReactNode
}

interface IState {
    hasError:boolean
}

class ErrorBoundary extends  Component<IProps,IState> {
    constructor(props:any){
        super(props);
        this.state = {hasError:false};
    }

    static getDerivedStateFromError(error:Error){
        return {hasError:true}
    }
    componentDidCatch(error:Error,errorInfo:ErrorInfo){
        console.error("Uncaught error:",error,errorInfo )
    }

    render(){
        if(this.state.hasError){
            return <h1>Something went wrong</h1>
        }
        return this.props.children
    }
}

export default ErrorBoundary