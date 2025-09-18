import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
// component files
import SearchForm from "./components/SearchForm";
import Nav from "./components/Nav";
import PhotoContainer from './components/PhotoContainer';
import InvalidPage from "./components/InvalidPage";

/**
 * App renders the whole app
 * */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            query: '',
            loading: true,
            sunsets: [],
            waterfalls: [],
            rainbows: []
        }
    }
    //default search actions when the app is started
    componentDidMount() {
        this.performSearch('rainbows');
        this.performSearch('sunsets');
        this.performSearch('waterfalls');
    }
    //implements the search action and the default search query on the navigation
    performSearch = (query, apiKey = process.env.REACT_APP_API_KEY) => {
        this.setState({ loading:true });
        axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${query}&per_page=24&format=json&nojsoncallback=1`)
            .then(response => {
                if (query === 'sunsets' || query === 'waterfalls'|| query ==='rainbows') {
                    this.setState({
                        [query]: response.data.photos.photo,
                        loading: false
                    })
                } else {
                    this.setState({
                        photos: response.data.photos.photo,
                        query,
                        loading: false
                    });
                }
            })
            .catch(error => {
                console.log('Error fetching and parsing data:', error)
            });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    <SearchForm onSearch={ this.performSearch } />
                    <Nav />
                    <Switch>
                        <Route exact path='/' render={
                            () => <Redirect to='/waterfalls' />
                        }/>
                        <Route exact path='/sunsets' render={
                            () => <PhotoContainer
                                data={ this.state.sunsets }
                                loading={ this.state.loading }
                                query='sunsets'
                            />
                        }/>
                        <Route exact path='/waterfalls' render={
                            () => <PhotoContainer
                                data={ this.state.waterfalls }
                                loading={ this.state.loading }
                                query='waterfalls'
                            />
                        }/>
                        <Route exact path='/rainbows' render={
                            () => <PhotoContainer
                                data={ this.state.rainbows }
                                loading={ this.state.loading }
                                query='rainbows'
                            />
                        }/>
                        <Route exact path='/search/:query' render={
                            () => <PhotoContainer
                                data={ this.state.photos }
                                loading={ this.state.loading }
                                query={ this.state.query }
                            />
                        }/>
                        <Route component={ InvalidPage } />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
