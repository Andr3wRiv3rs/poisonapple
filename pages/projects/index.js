import css from './index.sass'
import Projects from '../../projects.js'
import Link from 'next/link'

const Screenshots = (props) => (
    props.project.screenshots ? props.project.screenshots.map( screenshot => 
        <div 
            key={ 'screenshot-' + screenshot + props.keyAddition || '' } 
            className={ css.screenshot } 
            style={{
                backgroundImage: `
                    url(/static/projects/${props.project.id}/screenshots_lq/${screenshot}.png)
                `
            }} 
        />
    ) : ''
)   

const Links = (props) => (
    props.project.links ? props.project.links.map( link => 
        <a 
            key={ link.url } 
            type={ link.type } 
            target="_blank" 
            className={ css.project_link } 
            href={ link.url } 
            style={{
                backgroundImage: `
                    url(/static/icons/${link.type}_circle.svg)
                `
            }} 
        />
    ) : ''
)

const Handles = (props) => (
    props.project.handles ? 
        <div>
            {
                props.project.handles.map( handle => 
                    <a
                        key={ handle.value }
                        type={ handle.type }
                        target="_blank"
                        className={ `${css.handle} ${css.link}` }
                        href={ {
                            twitter: "https://twitter.com/@",
                            instagram: "https://www.instagram.com/",
                            gamejolt: "https://gamejolt.com/@",
                        }[handle.type] + handle.value }
                    >
                        @{ handle.value }
                    </a>
                )
            }
        </div> 
    : ''
)

const Description = (props) => {

    let { description } = props.project

    description = description.trim().split(/(?!\[[^\[\]]+)\s(?![^\[\]]+\])/g)

    for (let i=0; i<description.length; i++) {
        description[i] = ` ${description[i]} `

        const link = /(\[[^\[\]]+\])(\([^\(\)]+\))/g.exec(description[i])

        if (link !== null)
            description[i] = 
                <a 
                    key={ link[2] } 
                    className={ css.link }
                    target="_blank"
                    href={ link[2].replace(/(\(|\))/g, '') }>{ 
                    link[1].replace(/(\[|\])/g, '') }
                </a>
    }
    
    return (
        <p key={ description } className={ css.description }>{ description }</p>
    )
}

export default class extends React.Component {
    componentDidMount () {
        const elements = document.querySelectorAll(`.${css.screenshots}`)
        
        for (const screenshots of elements) 
            screenshots.scrollInterval = setInterval( 
                () => this.scrollScreenshots(screenshots),
                16.6
            )
    }

    scrollScreenshots (screenshots) {
        let { style: { top }, clientHeight } = screenshots.children[0]

        top = parseInt(top || 0) - 1

        if ( top * -1 >= clientHeight/2 ) top = 0

        screenshots.children[0].style.top = top + 'px'
    }

    render () {
        return (
            <div className={ css.projects }>
                {
                    Object.values(Projects).map( project =>
                        <div 
                            key={ project.id } 
                            className={ `${css.project}` } 
                            style={{
                                backgroundImage: `url(/static/projects/${project.id}/${project.id}.png)`
                            }}
                        >
                            <div>
                                <div className={ css.screenshots }>
                                    <Link 
                                        href={ `/projects/gallery?id=${project.id}` }
                                    >
                                        <div>
                                            <Screenshots project={ project } />
                                            <Screenshots project={ project } keyAddition={ `0` } />
                                        </div>
                                    </Link>
                                </div>

                                <div className={ css.info }>
                                    <div>
                                        <h2 className={ css.title }>{ project.title }</h2>
                                        <Links project={ project } />
                                    </div>

                                    <Handles project={ project } />
                                    <Description project={ project } description={ project.description }/>
                                    {
                                        project.screenshots ? 
                                            <Link
                                                href={ `/projects/gallery?id=${project.id}` }
                                            >
                                                <button>View Gallery</button>
                                            </Link> 
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>    
                    )
                }
            </div>
        )
    }
}