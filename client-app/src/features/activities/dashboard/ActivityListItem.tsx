import React from 'react'
import { Item, Button, Segment, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';
import {format} from 'date-fns'
import ActivityListItemAttendees from './ActivityListItemAttendees';

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {
    const host = activity.attendees.filter(x => x.isHost)[0];
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={host.image || '/assets/user.png'} style={{marginBottom: 3}} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by <Link to={`/profile/${host.username}`}>{host.displayName}</Link></Item.Description>
                            {activity.isHost && 
                                <Item.Description>
                                    <Label basic color='orange' content='You are hosting this activity' />
                                </Item.Description>
                            }
                            {activity.isGoing && !activity.isHost && 
                                <Item.Description>
                                    <Label basic color='green' content='You are going to this activity' />
                                </Item.Description>
                            }
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
                <ActivityListItemAttendees attendees={activity.attendees} />
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
