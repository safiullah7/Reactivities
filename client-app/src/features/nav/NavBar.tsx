import React from 'react'
import { Menu, Container, Button } from 'semantic-ui-react';

interface IProps {
    handleOpenCreateForm: () => void
}

export const NavBar: React.FC<IProps> = ({ handleOpenCreateForm }) => {
    return (
        <div>
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item header>
                        <img src="/assets/logo.png" alt="logo"/>
                    </Menu.Item>
                    <Menu.Item name='Activities' />
                    <Menu.Item>
                        <Button onClick={() => handleOpenCreateForm()} positive content='Create Activity'/>
                    </Menu.Item>
                </Container>
            </Menu>
        </div>
    )
}
