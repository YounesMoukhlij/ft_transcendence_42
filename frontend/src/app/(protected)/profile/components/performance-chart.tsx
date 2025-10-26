"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { IllustrationGraph } from "./graph"
import { IllustrationChart } from "./chart"
import { TrendingUp} from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"


interface PerformanceData {
  month: string
  wins: number
  losses: number
}

interface PerformanceChartProps {
  data: PerformanceData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {

  const [illustration, setIllustration] = useState<"graph" | "chart">("graph");
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 " />
          Performance Trends
        </CardTitle>
           <CardDescription>Monthly wins and losses over time</CardDescription>
        </div>
        <div>
          <Button data-state={illustration} onClick={()=> setIllustration("graph")}  variant="normal"  className="rounded data-[state=graph]:bg-primary mr-1">
          Graph
        </Button> 
        <Button data-state={illustration} onClick={()=> setIllustration("chart")} variant="normal"  className="data-[state=chart]:bg-primary">
           Chart
        </Button> 
        </div>
         
          </div>
      </CardHeader>
      {
        illustration == "graph" ? <IllustrationGraph data={data} /> : <IllustrationChart  data={data} /> 
      }
    </Card>
  )
}
