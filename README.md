## Github_DB_Manager

[Online tool for editing DB files in your GitHub Repositories.](https://linb.github.io/Github_DB_Manager)

You can use this online tool to log in your Github account, select repository, list DB tables(objects) and records(items), create, update and delete them in the browser.

<hr>

The entire program is done with codeless programming. The GitHub login function uses a cloud service module - GitHubDBHandler2, which works out of the box, enable your users log in to GitHub and operate their repositories directly. In CrossUI Builder, you can add it to your own project from CrossUI templates library.

<hr>

 The file structure for this Github DB implement is:

__crossui_db
>  objectName(tableName)
>>    item(record)

<hr>

In this DB implement, an item(a record) is saved as a JSON file

> Weaknesses: Records listed will lag a few seconds after editing

> Strengths: Up to 100,000, ordered by updated, can query by word

<b>[NOTICE]</b> Since the Github search engine need to take some time to build the index, the latest records in listItems API will lag a few seconds after editing (create, update, delete).

<hr>
Web app url : https://linb.github.io/Github_DB_Manager

This project was created by CrossUI No-Code App Builder: https://crossui.com/RADGithub

Based on template: https://linb.github.io/CrossUI_Assets/assets/projects/Simple/xui_project_tpl_Empty

Click [here](https://crossui.com/RADGithub/#!from=github&owner=linb&repo=Github_DB_Manager) to edit this web app in CrossUI No-Code App Builder

<i>Powered by [CrossUI](https://crossui.com)</i>
