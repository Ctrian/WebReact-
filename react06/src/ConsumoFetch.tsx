import {useState} from "react";

interface Post {
    id: number;
    title: string;
    body: string;
}

function ConsumoFetch() {
    //const url = 'https://jsonplaceholder.typicode.com/posts/1';

    const [postId, setPostId] = useState("1");
    // check como usar <Post | null>(null)
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false)


    const handleClick = () => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        //.then(data=>alert(data.title));
        .then(data => {
            setPost(data);
            //alert(post.title)
        })
        .catch(error => alert(error))
        .finally(()=> setLoading(false))
    }

    return (
        <>
        <h2>Fetch</h2>
            Id: <input type={"text"} placeholder={"id"}
        value={postId}
        onChange={e=> setPostId(e.target.value)}/>
            <button onClick={handleClick}>Consultar</button>
           {loading &&  <label>Cargando...</label>}
            <br/>
            {
                post && (
                    <div>
                        <p>Id: {post.id}</p>
                        <p>Title: {post.title}</p>
                        <p>Body: {post.body}</p>
                    </div>

                )
            }
                    <div>{postId}</div>
        </>
    )
}

export default ConsumoFetch;