import MovieCard from "../components/MovieCard";
import {useState} from "react";
import { useEffect } from "react";
import {searchMovies, getPopularMovies} from "../services/api";
import "../css/Home.css"

function Home(){
    const [searchQuery, setSearchQuery] = useState("")

    const [movies, setMovies] = useState([]);

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadPopularMovies = async () => {
            try{
                const movies = await getPopularMovies()
                setMovies(movies)
            }catch(err){
                console.error(err)
                setError("An error occurred. Please try again later.")
            }
            finally{
                setLoading(false)
            }
        }
        loadPopularMovies()
    }, [])

    const handleSearch = async(e) =>{
        e.preventDefault()
        if(!searchQuery.trim())return
        if(loading)return
        setLoading(true)
        try{
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        }catch(err){
            setError("An error occurred. Please try again later.")
        }finally{
            setLoading(false)
        }
    }

    return(
        <>
            <div className="home">
                <form onSubmit={handleSearch} className="search-form">
                    <input type="text" placeholder="Search for movies" className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                    <button type="submit" className="search-button">Search</button>
                </form>
                {error && <div className="error">{error}</div>}
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="movies-grid">
                        {movies.map((movie) => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default Home