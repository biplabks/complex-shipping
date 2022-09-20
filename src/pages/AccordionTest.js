import React from 'react';
import AccordionData from './AccordionData';
import MyContext from './MyContext';

const AccordionTest = () => (
  <MyContext.Consumer>
    {context => (
      <React.Fragment>
        <div>
          {
            <AccordionData />
          }
        </div>
      </React.Fragment>
    )}
  </MyContext.Consumer>
)

export default AccordionTest;