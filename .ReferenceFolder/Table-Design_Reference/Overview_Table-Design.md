Main Code Structure
Here is the file and folder hierarchy of the application:

.
├── index.html
├── index.tsx
├── metadata.json
└── src
    ├── app.component.html
    ├── app.component.ts
    ├── components
    │   └── data-table
    │       ├── data-table.component.html
    │       └── data-table.component.ts
    └── services
        └── data.service.ts
Files That Contain Code FOR the Table
These files are essential for the data table's data, logic, structure, and styling. If you were to recreate it, these are the files you would need.
src/components/data-table/data-table.component.ts
Role: The "Brain" of the Table. This file contains all the core TypeScript logic, including:
Defining the exact pixel width for every column.
Splitting the data into the four quadrants for the frozen pane layout.
Handling the scroll events to synchronize the movement of the different panes.
src/components/data-table/data-table.component.html
Role: The "Skeleton and Skin" of the Table. This file defines the entire visual structure and appearance using HTML and Tailwind CSS. It is responsible for:
Creating the 4-quadrant CSS grid that makes the frozen layout work.
Applying all the styling for the "liquid glass" effect (backdrop-blur), colors, borders, and typography.
Rendering all the data cells onto the screen.
src/services/data.service.ts
Role: The Data Source. This file acts as the table's database. It:
Holds the raw string of player statistics.
Contains the logic to parse that string into headers and data rows for the table component to use.
index.html
Role: Global Styling and Setup. This foundational file is critical for the table's appearance. It:
Loads the entire Tailwind CSS library, which the table depends on for all its styling.
Contains the custom CSS in the <style> block that gives the scrollbars their unique, dark-themed look.
src/app.component.html
Role: Thematic Host & Background. While this file hosts the main application, it's crucial for the table's overall aesthetic because it:
Places the <app-data-table> component onto the page.
Generates the animated "nebula" background gradients, which create the atmospheric look and feel that frames the table.
Files That DO NOT Contain Code for the Table
These files are necessary for the Angular application to run, but they do not contain any code that directly defines how the data table itself looks or works.
index.tsx
Role: Application Entry Point. This is the first file that runs. Its only job is to start up, or "bootstrap," the entire Angular application.
src/app.component.ts
Role: Root Component Class. This is the main container component for the entire application. Its primary responsibility is simply to import and make the DataTableComponent available to be used in its template (app.component.html).
metadata.json
Role: Environment Configuration. This file is used by the development environment. It contains no application code and has no effect on the final result.