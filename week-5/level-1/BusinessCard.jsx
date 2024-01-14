export function BusinessCard({props}){
    <div>
        <h1>{props.name}</h1>
        <h4>{props.description}</h4>
        <ul>{props.intrestes.map(intrest => {
            <li>{intrest}</li>
        })}</ul>
        <ul>
            {props.socials.map((social) => {
                <SocialsButton name={social.name} link={social.link}></SocialsButton>
            })}
        </ul>
    </div>
}

function SocialsButton({props}) {
    return (<>
    <a href={props.link}><button>{props.name}</button></a>
    </>)
}