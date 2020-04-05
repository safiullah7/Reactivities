import React from 'react'
import { Item, Button, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';
import {format} from 'date-fns'

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {
    
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Description>
                                Hosted by Bob
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' />{format(activity.date, 'h:mm a')}
                <Icon name='marker' />{activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                {/* secondary will give a little grey colour to separate out */}
                Attendees will go here
            </Segment>
            <Segment clearing>
                {/* adding clearing because we have a button here */}
                <span>{activity.description}</span>
                <Button floated='right' content='View' color='blue'
                    as={Link} to={`/activities/${activity.id}`}
                />
            </Segment>
        </Segment.Group>
        
    )
}
