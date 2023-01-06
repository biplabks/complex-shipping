import React from 'react';
import BootstrapTable from './BootstrapTable';
import MyContext from './MyContext';

const AccordionData = () => (
  <MyContext.Consumer>
    {context => (
      <React.Fragment>
          {
            context.formattedItemsByDueDate.length > 0 &&
            <div>
              <BootstrapTable
                orderDetails={context.formattedItemsByDueDate}
                listOfPromiseDates={context.listOfPromiseDates}
                listOfUniqueDates={context.listOfUniqueDates}
                listOfUniqueDueDates={context.listOfUniqueDueDates}
              />
            </div>
          }
      </React.Fragment>
    )}
  </MyContext.Consumer>
)

export default AccordionData;