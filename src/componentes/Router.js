import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Navegacion from './Navegacion';
import Posts from './Posts';
import SinglePost from './SinglePost';
import Formulario from './Formulario';
import Swal from 'sweetalert2';
import Editar from './Editar';
import swal from 'sweetalert2';


class Router extends Component {

    state = {
        posts: []
    }

    componentDidMount() {
        this.obtenerPosts();
    }

    obtenerPosts = () => {
        axios.get(`https://jsonplaceholder.typicode.com/posts`)
            .then(res => {
                this.setState({
                    posts: res.data
                })
            })
    }

    borrarPost = (id) => {
        axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`)
            .then(res=>{
                if(res.status === 200) {
                    const posts = [...this.state.posts];
       // Con el spread operator traemos una copia del state


       //Filtramos el resultado y queremos que devuelva un state con todos los id menos el borrado
                    let resultado = posts.filter(post => (
                        post.id !== id
                    ))
                    this.setState({
                        posts: resultado
                    })
                }
            })
    }


    crearPost = (post) => {
        axios.post(`https://jsonplaceholder.typicode.com/posts`,{post})
            .then(res =>{
                if(res.status === 201){

                    Swal(
                        'Good job!',
                        'You created a Post!',
                        'success'
                      )

                    let postId = {id: res.data.id}
                    const nuevoPost = Object.assign({}, res.data.post, postId)
//En la linea anterior unimos datos que vienen por separado en un unico objeto
                    this.setState(prevState => ({
                        posts: [...prevState.posts, nuevoPost]
                    }))
                }
            })
    }

    editarPost = (postActualizado) => {

        const {id} = postActualizado;

            axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {postActualizado})
            .then(res =>{
                if(res.status === 200){

                    swal(
                        'Post Actualizado',
                        'Se guardó correctamente',
                        'success'
                    )

                    let postId = res.data.id;

                    const posts = [...this.state.posts];

                    const postEditar = posts.findIndex(post => postId === post.id);   

                    posts[postEditar] = postActualizado;

                    this.setState({
                        posts
                    })
                }
            })

    }

    render(){
        return(
            <BrowserRouter>
                <div className="container">
                    <div className="row justify-content-center">
                        <Header />
                        <Navegacion />
                        <Switch>
                            <Route exact path="/" render={() => {
                                return(
                                    <Posts 
                                        posts={this.state.posts}
                                        borrarPost={this.borrarPost}
                                    />
                                )
                            }}
                            />
                            <Route exact path="/post/:postId" render={ (props) => {
                                //Con esta sintaxis fitramos el id 
                                let idPost = props.location.pathname.replace('/post/', '');
                                
                                const posts = this.state.posts;

                                let filtro;
                                filtro= posts.filter(post => (
                                    post.id === Number(idPost)
                                ))


                                return(
                                    <SinglePost 
                                        post={filtro[0]}
                                    />
                                )
                            }} 

                            />
                            <Route exact path="/crear/" render={() => {
                                return(
                                    <Formulario 
                                        crearPost = {this.crearPost}
                                    />
                                )
                            }}
                            
                            />
                            <Route exact path="/editar/:postId" render={ (props) => {
                                //Con esta sintaxis fitramos el id 
                                let idPost = props.location.pathname.replace('/editar/', '');
                                
                                const posts = this.state.posts;

                                let filtro;
                                filtro= posts.filter(post => (
                                    post.id === Number(idPost)
                                ))


                                return(
                                    <Editar
                                        post={filtro[0]}
                                        editarPost={this.editarPost}
                                    />
                                )
                            }} 

                            />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

export default Router;