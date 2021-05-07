import React from "react"
import { 
    BarChart, Bar, XAxis, YAxis,
    Tooltip, Legend, CartesianGrid,ResponsiveContainer
 } from 'recharts'

interface IProps {
    data:any[]
}

const Chart:React.FC<IProps> = ({data}) => {

    return(
        <ResponsiveContainer width={"100%"} height={269} >
            <BarChart 
                data={data}
                margin={{
                top: 5, right: 100, bottom: 0,left:5
                }}
            >
                <CartesianGrid strokeDasharray="0 1" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Members" fill="#4791FF" />
                <Bar dataKey="Events" fill="#FFD950" />
                <Bar dataKey="Finances" fill="#02BC77" />
                <Bar dataKey="newMembers" fill="#FF2366" />
        </BarChart>
        </ResponsiveContainer>
    )
}

export default Chart