import React from 'react';
import {Button, Header, Icon, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";

const NotFound = () => {
	return (
		<Segment placeholder>
			<Header icon>
				<Icon name='search'/>
				There were not results for your search
			</Header>
			<Segment.Inline>
				<Button as={Link} to='/activities' primary>
					Return to the activities page
				</Button>
			</Segment.Inline>
		</Segment>
	)
}

export default NotFound;
