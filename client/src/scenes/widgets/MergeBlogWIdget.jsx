import { Typography, useTheme, List, ListItem, ListItemText } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const mustReadPosts = [
  { title: '* Please read rules before you submit ideas on platform', url: '#1' },
  { title: '* Vision & Strategy of MergeMinds', url: '#2' },
];

const FAQs = [
  { question: '* How to submit an idea?', url: '#1' },
  { question: '* How to apply to the idea?', url: '#2' },
  { question: '* How to protect your idea?', url: '#3' }
];

const MergeBlogWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Must-read posts
        </Typography>
      </FlexBetween>
      <List>
        {mustReadPosts.map((post, index) => (
          <ListItem key={index} component="a" href={post.url}>
            <ListItemText primary={post.title} />
          </ListItem>
        ))}
      </List>
      
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          FAQs
        </Typography>
      </FlexBetween>
      <List>
        {FAQs.map((faq, index) => (
          <ListItem key={index} component="a" href={faq .url}>
            <ListItemText primary={faq.question} />
          </ListItem>
        ))}
      </List>
    </WidgetWrapper>
  );
};

export default MergeBlogWidget;
