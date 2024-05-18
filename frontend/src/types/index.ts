// Interface for all types
import { type ChartType } from 'chart.js'

export interface signUpData {
    email: string,
    verificationCode: string,
    password: string,
    confirmPassword: string,
    prompt: string,
}

export interface signInData {
    email: string,
    password: string
}

export interface Novel_base_inf {
    name: string,
    primary_genre: string,
    rating_votes: number,
    click_nums: number,
}

export interface RankData{
    name: string,
    votes_today: number,
    votes_growth: number,
    clicks_today: number,
    clicks_growth: number
}

export interface Option {
    id: string,
    name: string,
    typeName: ChartType,
}

export interface Chart_inf {
    id: string
    name: string,
}

export interface Chart_caption {
    id: string,
    chartName: string,
    caption?: string,
}
interface SubItem {
    id: string;
    name: string;
    percentage: number;
}

// Interface for Array types
export type Options = Option[]
export type Charts_inf = Chart_inf[]
export type Chart_captions = Chart_caption[]
export type SubCharts = SubItem[]
export type RankDatas = RankData[]
