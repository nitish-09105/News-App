import React, { Component } from 'react'
import NewsItem from '../NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

export class News extends Component {

  // generating props that are required for this page
  static defaultProps={
    country:'in',
    pageSize:8,
    category:'general'
  }
  static propTypes={
    country:PropTypes.string,
    pageSize:PropTypes.number,
    category:PropTypes.string
  }


  capitalizeFirstLetter=(string)=>{
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  constructor(props){
    super(props);
    this.state={
      articles: [],
      loading: true,
      page:1,
      totalResults:0
    }
    document.title=`${this.capitalizeFirstLetter(this.props.category)} - NewsApp`;
  }


  // update news
  async updateNews(){
    this.props.setProgress(10)
    const url=
    `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    // run loading till not false
    this.setState({loading:true})
    //fetching the data from url
    let data=await fetch(url);
    this.props.setProgress(30)
    let parsedData=await data.json()
    this.props.setProgress(0)
    console.log()
    this.setState({
      articles:parsedData.articles, 
      totalResults:parsedData.totalResults, 
      loading:false
    })
    this.props.setProgress(100)
  }
  

  //componentdidmount-> method is invoked after all the elements of the page have been rendered correctly, aka after the first render () cycle. This is the final step of the mounting process.
  async componentDidMount(){
    this.updateNews()
  }

  // // previous button 
  // handlePrevClick=async()=>{
  //   this.setState({page:this.state.page-1})
  //   this.updateNews()
  // }

  // // next button
  // handleNextClick=async()=>{
  //   this.setState({page:this.state.page+1});
  //   this.updateNews();  
  // }


  // fetch more data after scrolling
  fetchMoreData=async()=>{
    this.setState({page:this.state.page+1})
    const url=
    `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    //fetching the data from url
    let data=await fetch(url);
    let parsedData=await data.json()
    this.setState({
      articles:this.state.articles.concat(parsedData.articles), 
      totalResults:parsedData.totalResults
    })
    
  }
  render() {
    return (
      <>
        <h1 className='text-center' style={{margin:'35px 0px'}}>NewsAPP - Top {this.capitalizeFirstLetter(this.props.category)}  Headlines</h1>
        {/* if loading true then show spinner else don't show */}
        {this.state.loading && <Spinner/>}

        <InfiniteScroll
        dataLength={this.state.articles.length} 
          next={this.fetchMoreData}
          hasMore={this.state.articles.length!==this.state.totalResults}
          loader={<Spinner />}>
        
        
        {/* fetching data from api           */}
        <div className="container">
        <div className="row">
          {/* apply loading till the data fetched */}
          {this.state.articles.map((element)=>{
            return <div className="col-md-4 " key={element.url}>
              <NewsItem title={element.title?element.title.slice(0,45):''}  description={element.description?element.description.slice(0,88):''} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
            </div>
          })}
          </div>
          </div>
        </InfiniteScroll>
          {/* <div className="containe d-flex justify-content-between">
          <button disabled={this.state.page<=1} type="button" onClick={this.handlePrevClick} className=" btn btn-dark">&larr;Previous</button>
          <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" onClick={this.handleNextClick} className="btn btn-dark ">Next &rarr;</button>
          </div> */}
          
        </>
    )
  }
}
export default News;