import { Typography, useTheme, List, ListItem, ListItemText, ListItemIcon, Box } from "@mui/material";
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const mustReadPosts = [
  { title: 'Please read rules before you submit ideas on platform', url: '#1' },
  { title: 'Vision & Strategy of MergeMinds', url: '#2' },
];

const FAQs = [
  { question: 'How to submit an idea?', url: '#1' },
  { question: 'How to apply to the idea?', url: '#2' },
  { question: 'How to protect your idea?', url: '#3' }
];

const MergeBlogWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const blue = palette.primary.dark;

  return (
    <WidgetWrapper>
      <FlexBetween gap="1rem">
					<Box
						display="flex"  // Added display="flex"
						alignItems="center" // Added alignItems="center"																
					>
            <StarBorderIcon />
            <Typography color={dark} variant="h5" fontWeight="500" sx={{ marginLeft: '8px'}}>
              Must-read posts
            </Typography>          
					</Box>				
			</FlexBetween>
      <List>
        {mustReadPosts.map((post, index) => (
          <ListItem key={index} component="a" href={post.url} sx={{ paddingY: '4px' }}>
            <ListItemIcon sx={{ minWidth: 'unset', marginRight: '4px' }}>
              <FiberManualRecordIcon sx={{ color: main, fontSize: 14 }} />
            </ListItemIcon>
            <ListItemText primary={post.title} sx={{ color: blue, marginTop: '2px', marginBottom: '2px', marginLeft: '8px' }} />
          </ListItem>
        ))}
      </List>
      <FlexBetween gap="1rem">
					<Box
						display="flex"  // Added display="flex"
						alignItems="center" // Added alignItems="center"								
					>
            <LiveHelpIcon />
            <Typography color={dark} variant="h5" fontWeight="500" sx={{ marginLeft: '8px'}}>
              FAQs
            </Typography>          
					</Box>				
			</FlexBetween>
      <List>
        {FAQs.map((faq, index) => (
          <ListItem key={index} component="a" href={faq.url} sx={{ paddingY: '4px' }}>
            <ListItemIcon sx={{ minWidth: 'unset', marginRight: '4px' }}>
              <FiberManualRecordIcon sx={{ color: main, fontSize: 14 }} />
            </ListItemIcon>
            <ListItemText primary={faq.question} sx={{ color: blue, marginTop: '2px', marginBottom: '2px', marginLeft: '8px' }} />
          </ListItem>
        ))}
      </List>
    </WidgetWrapper>
  );
};

export default MergeBlogWidget;
