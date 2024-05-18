import axios from "axios"

const NOVELS_API = 'http://127.0.0.1:8001/appDemo/novels'

export function useNovels(){
    async function uploadNovels(jsonData: JSON){
        try{
            const response = await axios.post(`${NOVELS_API}/upload/`, jsonData)
            return response.data
        } catch (error){
            throw error
        }
    }

    async function getNovelsSort(field: string){
        try{
            const response = await axios.post(`${NOVELS_API}/view_sort/`, {
                sort_field: 'rating',
            }) 
            return response.data
        } catch (error){
            throw error
        }
    }

    async function getStatisticsData(target: string){
        try{
            const response = await axios.post(`${NOVELS_API}/statistics/`, {
                analysis_target: target,
            })
            return response.data
        } catch (error){
            throw error
        }
    }
    async function check_genre(ranking_target: string| null){
        try{
            const response = await axios.post(`${NOVELS_API}/check_genre/`, {
                ranking_target: ranking_target,
            })
            return response.data
        } catch (e) {
            throw e
        }
    }
    
    async function getNovalRank(novel_name: string | null, ranking_target: string| null, primary_genre: string| null, date_range: string| null){
        try{
            const response = await axios.post(`${NOVELS_API}/noval_rank/`, {
                novel_name: novel_name,
                ranking_target: ranking_target,
                primary_genre: primary_genre,
                date_range: date_range,
            })
            return response.data
        } catch (e) {
            throw e
        }
    }


    return {uploadNovels, getNovelsSort, getStatisticsData, check_genre, getNovalRank}
}