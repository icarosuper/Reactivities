import React from 'react';
import {Dimmer, Loader} from "semantic-ui-react";

interface Props {
	inverted?: boolean;
	content?: string;
}

const LoadingComponent = ({inverted, content}: Props) => {
	return (
		<Dimmer active={true} inverted={inverted || true}>
			<Loader content={content || 'Loading'}/>
		</Dimmer>
	)
}


export default LoadingComponent;
