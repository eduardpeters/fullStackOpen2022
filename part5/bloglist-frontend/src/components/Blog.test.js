import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
    let container

    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Mr. Incredible',
        url: 'somewhere.around',
        likes: 42,
        user: {
            name: 'El Nombre'
        }
    }

    beforeEach(() => {
        container = render(
            <Blog blog={blog} />
        ).container
    })

    test('testing the correct initial render of Blogs', () => {
        // getByText needs the text to be exact, otherwise use ,{ exact: false }
        let element = screen.getByText('Component testing is done with react-testing-library Mr. Incredible')
        expect(element).toBeDefined()
        // url and likes should not be rendered
        element = screen.queryByText('somewhere.around')
        expect(element).toBeNull()
        element = screen.queryByText('likes 42 ')
        expect(element).toBeNull()
    })

    test('testing the requested detailed render of Blogs', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        const div = container.querySelector('.blogDetails')
        expect(div).not.toHaveStyle('display: none')

        let element = screen.queryByText('somewhere.around')
        expect(element).toBeDefined()
        element = screen.queryByText('likes 42 ')
        expect(element).toBeDefined()
    })

    test('testing the detailed render of Blogs can be hidden', async () => {
        const user = userEvent.setup()
        const buttonView = screen.getByText('view')
        await user.click(buttonView)
        const buttonHide = screen.getByText('hide')
        await user.click(buttonHide)

        const div = container.querySelector('.blogDetails')
        expect(div).toHaveStyle('display: none')
    })
})

describe('<Blog /> like button', () => {
    test('like button pressed twice makes two calls to callback function', async () => {
        const updateBlog = jest.fn()
        const user = userEvent.setup()
        const blog = {
            title: 'Component testing is done with react-testing-library',
            author: 'Mr. Incredible',
            url: 'somewhere.around',
            likes: 42,
            user: {
                name: 'El Nombre'
            }
        }

        render(<Blog blog={blog} updateBlog={updateBlog}/>)

        const buttonView = screen.getByText('view')
        await user.click(buttonView)

        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(updateBlog.mock.calls).toHaveLength(2)
    })
})