import React from 'react';
import GridPageTemplate from './GridPageTemplate';
import { PAGES } from '../utils/gridActionSystem';
import MatrixSpiralCanvas from './MatrixSpiralCanvas';

const LayeredInterface = () => {
  // Context for home page actions (animation controllers, etc.)
  const homeContext = {
    animationController: {
      fastForward: () => {
        console.log('Fast forward animation triggered');
        // Add your animation logic here
      }
    },
    zoomController: {
      toggle: () => {
        console.log('Zoom toggled');
        // Add your zoom logic here
      }
    }
  };

  const backgroundComponent = <MatrixSpiralCanvas />;

  return (
    <GridPageTemplate
      pageId={PAGES.HOME}
      context={homeContext}
      backgroundComponent={backgroundComponent}
      pageName="Home Interface"
    />
  );
};

export default LayeredInterface; 