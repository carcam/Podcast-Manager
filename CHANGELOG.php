<?php
/**
* Podcast Manager for Joomla!
*
* @copyright	Copyright (C) 2011 Michael Babker. All rights reserved.
* @license		GNU/GPL - http://www.gnu.org/copyleft/gpl.html
* @package		PodcastManager
* @subpackage	com_podcastmanager
*
* Podcast Manager is based upon the ideas found in Podcast Suite created by Joe LeBlanc
* Original copyright (c) 2005 - 2008 Joseph L. LeBlanc and released under the GPLv2 license
*/

// No direct access
defined('_JEXEC') or die;
?>

8-August-2011 Michael Babker
# Fix a bug with the RSS path generation logic

2-August-2011 Michael Babker
~ Update pt-BR translation
~ Update SM2 to V2.97a.20110801

31-July-2011 Michael Babker Version 1.8 Changes
+ Add scriptfiles to the files packages to do basic pre-install checks
+ Add error checks for SQL in scriptfiles

29-July-2011 Michael Babker Version 1.8 Changes
# Correct the package XML so that it uninstalls the getID3 library too
~ Add script to add dummy menu item to supress error message at uninstall
~ Change version check notice to use JText
~ Add error checking to plugin activation functions

26-July-2011 Michael Babker Version 1.8 Changes
# File paths were incorrectly getting the site path stored with them
! Rework preg_match check in RSS feed to prevent path disclosure

23-July-2011 Michael Babker Version 1.8 Changes
- Removed Information view
- Removed Components submenu items
+ Added cpanel view as new default landing
+ Added Akeeba Live Update support

21-July-2011 Michael Babker Version 1.8 Changes
+ Add script to display the position within the playing file

17-July-2011 Michael Babker Version 1.8 Changes
+ Add ability to select default sorting for feed view
+ Add pt-BR translation
~ Update Akeeba Backup System Restore Point definition
~ Convert Information view to JText
# Correct a bug with the published count on feeds admin view
~ Added additional SQL security from Platform 11.1

14-July-2011 Michael Babker Version 1.7 Changes
+ Add ability to link to off-site media

13-July-2011 Michael Babker Version 1.8 Changes
+ Allow front end feed view to render onContentPrepare plugin
+ Add parameter to render the media player on the feed view
~ Optimize the content plugin to handle data from the feed view

12-July-2011 Michael Babker Version 1.8 Changes
+ Add script to display the runtime

10-July-2011 Michael Babker Version 1.8 Changes
+ Add SoundManager2 media player
~ Add demo MP3 player from SM2 site

10-July-2011 Michael Babker Version 1.7 Changes
# Fix a bug in custom code rendering for content plugin

5-July-2011 Michael Babker Version 1.8 Changes
# Fix routing bug for front end edit
- Remove create link from feed view because of routing bug
~ Rename routing functions specific to podcast edit
+ Add front end feed edit view
+ Add batch processing

30-June-2011 Michael Babker Version 1.8 Changes
~ Rename the layouts for the HTML view
~ Language strings for various menu components
+ Routing and methods for podcast edit
+ Add podcast edit view
# Fix routing bug in front end media

30-June-2011 Michael Babker Version 1.7 Changes
# Correct the installation SQL with the summary changes

29-June-2011 Michael Babker Version 1.8 Changes
+ Add a feed listing module

29-June-2011 Michael Babker Version 1.7 Changes
# Modified podcast summary field to allow up to 5120 characters
# Fixed storage bug with itunescategory field

28-June-2011 Michael Babker Version 1.8 Changes
# Joomla! 1.6.4 security fix
+ Added pagination to list layout
+ Added feed link to head
- Removed params conversion in getItems
+ Add support for Akeeba Backup System Restore Points

28-June-2011 Michael Babker Version 1.7 Changes
# Correct counts for feeds view
# Fix media installer

22-June-2011 Michael Babker Version 1.8 Changes
+ Added JHtmlIcon helper for front end
~ Made consistent JEXEC checks
# Changed com_podcastmedia to delete menus on postflight (again)
+ Add PodcastManagerHelperRoute

20-June-2011 Michael Babker Version 1.8 Changes
+ Rough addition of front end HTML view for feeds
~ Cleanup of the HTML view

19-June-2011 Michael Babker Version 1.7 Changes
~ Optimize media manager navigation for Joomla! 1.7
# Add a missing language string for the File Manager
~ Convert toolbar tasks from JToolBarHelper::custom to defined tasks as appropriate
~ Add a check to the scriptfiles for Joomla! 1.7
~ Mark the XML files for Joomla! 1.7
- Removed the Hathor media view override
# Corrected the Hathor overrides update check
~ Syncronized core layouts to current Joomla! SVN
~ Updated PodcastManagerModelFeeds to use modified methods from MenusModelMenus