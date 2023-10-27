import React, { useEffect, useState } from 'react'
import NewsItem from '../NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

const News=(props)=>{
  const[articles,setArticles]=useState([])
  const[loading,setLoading]=useState(true)
  const[page,setPage]=useState(true)
  const[totalResults,setTotalResults]=useState(true)
  

  const capitalizeFirstLetter=(string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1);
  }


  // update news
  const updateNews= async()=>{
    props.setProgress(10)
    const url=
    `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    // run loading till not false
    setLoading(true)
    //fetching the data from url
    let data=await fetch(url);
    props.setProgress(30)
    let parsedData=await data.json()
    props.setProgress(70)
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100)
  }
  
  // render for updating news similar to component did mount
  useEffect(()=>{
    document.title=`${capitalizeFirstLetter(props.category)} - NewsApp`;
    updateNews()
  },[])

  // // // previous button 
  // const handlePrevClick=async()=>{
    
  //   setPage(page-1)
  //   updateNews()
  // }

  // // // next button
  // const handleNextClick=async()=>{
  //   setPage(page+1)
  //   updateNews();  
  // }


  // fetch more data after scrolling
  const fetchMoreData=async()=>{
    
    const url=
    `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    //fetching the data from url
    let data=await fetch(url);
    let parsedData=await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)

    
  }

    return (
      <>
        <h1 className='text-center' style={{margin:'35px 0px', marginTop:'90px'}}>NewsAPP - Top {capitalizeFirstLetter(props.category)}  Headlines</h1>
        <InfiniteScroll
        dataLength={articles.length} 
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          loader={<Spinner />}>
        
        {/* fetching data from api           */}
        <div className="container">
        <div className="row">
          {/* apply loading till the data fetched */}
          {articles.map((element)=>{
            return <div className="col-md-4 " key={element.url}>
              <NewsItem title={element.title?element.title.slice(0,45):''}  description={element.description?element.description.slice(0,88):''} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
            </div>
          })}
          </div>
          </div>
        </InfiniteScroll>
          {/* previous and next buttons  */}
          {/* <div className="containe d-flex justify-content-between">
          <button disabled=state.page<=1} type="button" onClick={handlePrevClick} className=" btn btn-dark">&larr;Previous</button>
          <button disabled={page+1 > Math.ceil(totalResults/props.pageSize)} type="button" onClick={handleNextClick} className="btn btn-dark ">Next &rarr;</button>
          </div> */}
          
        </>
    )
  
}


// generating props that are required for this page
News.defaultProps={
  country:'in',
  pageSize:8,
  category:'general'
}
News.propTypes={
  country:PropTypes.string,
  pageSize:PropTypes.number,
  category:PropTypes.string
}
export default News;