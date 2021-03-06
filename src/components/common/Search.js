import React from 'react';
import {withRouter} from 'react-router-dom';
import Loading from './Loading';
import { API_URL } from '../../config';
import { handleResponse } from '../../helpers';
import './Search.css';

class Search extends React.Component{

    constructor(){
        super();
        this.state={
            searchResults: [],
            searchQuery: '',
            loading: false

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    handleRedirect(currencyId){
        //clear input when routing
        this.setState({
            searchQuery: '',
            searchResults: []
        })

        this.props.history.push(`/currency/${currencyId}`);
    }

    handleChange(event){ 
        const searchQuery = event.target.value;

        this.setState({ searchQuery });
        //if searchquery is not present, don't send request to server.
        if(!searchQuery){
            return '';
        }
        
        this.setState({loading: true})

        fetch(`${API_URL}/autocomplete?searchQuery=${searchQuery}`)
        .then(handleResponse)
        .then((result)=>{
            //console.log(result)
            this.setState({
                loading: false,
                searchResults: result
            })
        })
    }

    renderSearchResults(){
        const {searchResults, searchQuery, loading} = this.state;

        if(!searchQuery){
            return '';
        }
        if(searchResults.length > 0){
            return(
                <div className = "Search-result-container">
                    {searchResults.map(result =>(
                        <div 
                            key={result.id}
                            className="Search-result"
                            onClick={()=>this.handleRedirect(result.id)}
                        >
                            {result.name} ({result.symbol})
                        </div>

                    ))}
                </div>
            );
        }
        
        if(!loading){
            return(
                <div className="Search-result-container">
                    <div className = "Search-no-result">
                        No results found.
                    </div>
                </div>
            )
        }
    }
    render(){
        const { loading, searchQuery } = this.state;

        return(
            <div className="Search">

                <span className="Search-icon" /> 
                <input
                    type="text"
                    placeholder="Search coin"
                    className="Search-input"
                     onChange = {this.handleChange}
                     value={searchQuery}
                />

                {loading && 
                <div className="Search-loading">
                    <Loading
                        width='12px'
                        height='12px'
                    />
                </div>
                }

                {this.renderSearchResults()}
            </div>

        )
    }
}

export default withRouter(Search)