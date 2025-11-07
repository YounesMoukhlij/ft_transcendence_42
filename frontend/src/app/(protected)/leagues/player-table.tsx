"use client"

import { useState, useMemo } from "react"
import { Card } from "@/app/(protected)/profile/components/ui/card"
import { Input } from "@/app/(protected)/profile/components/ui/input"
import { Button } from "@/app/(protected)/profile/components/ui/button"
import { Badge } from "@/app/(protected)/profile/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/(protected)/profile/components/ui/table"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"

interface Player {
  id: string
  name: string
  gamesPlayed: number
  wins: number
  losses: number
  pointsScored: number
  pointsConceded: number
  difference: number
  experience: number
}

interface PlayerTableProps {
  league: string;
  data: Player[]; 
}

type SortField = keyof Player
type SortDirection = "asc" | "desc" | null

export function PlayerTable({ league, data }: PlayerTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("difference")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")


  // const players = useMemo(() => generatePlayers(league), [league]) // we will not need this when we use API
  const players = data;
  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = players?.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))


    // Apply sorting
    if (sortField && sortDirection) {
      filtered?.sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }

        return sortDirection === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
      })
    }

    return filtered
  }, [players, searchTerm, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : sortDirection === "asc" ? null : "desc")
      if (sortDirection === "asc") {
        setSortField("difference") // Reset to default
      }
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    if (sortDirection === "desc") return <ArrowUp className="h-4 w-4" />
    if (sortDirection === "asc") return <ArrowDown className="h-4 w-4" />
    return <ArrowUpDown className="h-4 w-4" />
  }

  const getLeagueTitle = () => {
    switch (league) {
      case "bronze":
        return "Bronze League Players"
      case "silver":
        return "Silver League Players"
      case "gold":
        return "Gold League Players"
      default:
        return "Players"
    }
  }

  const getLeagueBadge = () => {
    switch (league) {
      case "bronze":
        return <Badge className="bg-amber-600 text-white">BRONZE</Badge>
      case "silver":
        return <Badge className="bg-slate-500 text-white">SILVER</Badge>
      case "gold":
        return <Badge className="bg-yellow-500 text-black">GOLD</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-card-foreground">{getLeagueTitle()}</h2>
            {getLeagueBadge()}
          </div>
          <div className="text-muted-foreground">
            {filteredAndSortedPlayers?.length} of {players?.length} players
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/70">
                <TableHead className="text-muted-foreground font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Player Name {getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead className="text-center text-muted-foreground font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("gamesPlayed")}
                    className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Games {getSortIcon("gamesPlayed")}
                  </Button>
                </TableHead>
                <TableHead className="text-center text-muted-foreground font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("wins")}
                    className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Wins {getSortIcon("wins")}
                  </Button>
                </TableHead>
                <TableHead className="text-center text-muted-foreground font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("losses")}
                    className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Losses {getSortIcon("losses")}
                  </Button>
                </TableHead>
                <TableHead className="text-center text-muted-foreground font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("pointsScored")}
                    className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Points Scored {getSortIcon("pointsScored")}
                  </Button>
                </TableHead>
                <TableHead className="text-center text-muted-foreground font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("pointsConceded")}
                    className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Points Conceded {getSortIcon("pointsConceded")}
                  </Button>
                </TableHead>
                <TableHead className="text-center text-muted-foreground font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("difference")}
                    className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Difference {getSortIcon("difference")}
                  </Button>
                </TableHead>
                <TableHead className="text-center text-muted-foreground font-semibold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("experience")}
                    className="h-auto p-0 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Exp {getSortIcon("experience")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedPlayers?.map((player, index) => 
              (
                <TableRow key={player.id} className="hover:bg-muted/30 transition-colors border-border">
                  <TableCell className="font-medium text-card-foreground">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{index + 1}</span>
                       <Link
                      href={`/profile/${player.name}`} // navigate to their profile
                      className="hover:underline text-blue-500"
                      >
                      {player.name}
                    </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-card-foreground">{player.gamesPlayed}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-accent font-semibold">{player.wins}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-destructive font-semibold">{player.losses}</span>
                  </TableCell>
                  <TableCell className="text-center text-card-foreground font-medium">
                    {player.pointsScored.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center text-card-foreground font-medium">
                    {player.pointsConceded.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-bold ${
                        player.difference > 0
                          ? "text-accent"
                          : player.difference < 0
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {player.difference > 0 ? "+" : ""}
                      {player.difference}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-primary font-semibold">{player.experience}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedPlayers?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No players found matching your criteria.</div>
        )}
      </div>
    </Card>
  )
}
