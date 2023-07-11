import { useState } from 'react';
import { Typography, useTheme, List, ListItem, ListItemText, ListItemIcon, Box } from "@mui/material";
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

const mustReadPosts = [
  { title: 'Rules for submitting an idea', url: '#1', content: `When submitting an idea on our platform, please adhere to the following rules to ensure a positive and respectful environment. 
  
  First and foremost, all ideas must be original and should not infringe upon the intellectual property rights of others. It is important to provide comprehensive and well-developed information about your idea to facilitate understanding. 
  
  Throughout your interactions, maintain a professional and respectful tone with other users. While we provide measures to protect your idea's confidentiality, exercise caution when sharing sensitive or proprietary information. You retain ownership of your intellectual property, but be mindful of the information you disclose to others. 
  
  Ensure that your ideas comply with applicable laws and regulations and do not involve illegal activities. Responsible use of the platform is expected, including refraining from spamming or engaging in disruptive behavior. 
  
  Please familiarize yourself with and comply with our platform's terms of service and guidelines. Respect the intellectual property of others and obtain necessary permissions for any copyrighted materials you may use. 
  
  By following these guidelines, we create an environment that encourages creativity, collaboration, and mutual respect.` },

  { title: 'Vision & Strategy of MergeMinds', url: '#2', 
  content: `At MergeMinds, our vision is to empower individuals with innovative ideas
   and diverse skill sets to come together, collaborate, and build groundbreaking start-ups that can change the world. We believe that by connecting ambitious 
   entrepreneurs with talented professionals, we can create an environment that fosters creativity, drives entrepreneurship, and unlocks the potential for 
   revolutionary business ventures. 
   
   Strategy:

   Connect Visionaries and Skillful Minds: Provide a user-friendly platform for entrepreneurs to post start-up ideas and connect with skilled professionals.

   Curate a Vibrant Community: Foster an engaging environment for networking, knowledge sharing, and inspiration through forums and events.

   Facilitate Idea Validation and Development: Offer tools, resources, and mentorship programs to refine start-up ideas and develop business plans.

   Connect with Investors and Opportunities: Establish partnerships with investors and provide opportunities for start-ups to showcase their potential.

   Enable Continuous Learning and Development: Offer educational resources and workshops to enhance skills and stay updated on industry trends.
   `
  },
];

const FAQs = [
  { title: 'How to submit an idea?', url: '#1', content: `To submit an idea, simply click on the "Submit Idea" button located at the top of the page. 
  
  Choose the relevant category and location for your idea. You also have the option to make your idea post hidden, which means it will only be visible to users who have applied to your idea. Provide a captivating title and a detailed description of your idea. You can enhance your post by adding a relevant picture. 
  
  Finally, to post your idea, you will need 4 MergeCoins.` },

  { title: 'How to apply to an idea?', url: '#2', content: `To apply for an idea, click on the "Apply" button located at the top right side of the idea post that interests you. 
  
  Prepare a cover letter that showcases your skills, experiences, and passion for the idea. Attach your resume as a PDF document to provide further information about your qualifications. 
  
  It will prompt you to confirm your application by deducting 2 MergeCoins from your account. 
  
  Once applied, the idea owner will be notified of your interest and can review your application.` },

  { title: 'How to protect your idea?', url: '#3', content: `While it's important to understand that no method provides absolute protection, there are several steps you can take to safeguard your idea. 
  
  Firstly, consider making your idea post hidden, so it remains visible only to users who have applied. 
  
  Additionally, it is wise not to disclose every intricate detail of your idea publicly. You can share more specifics with interested individuals during the application review process or after establishing a confidentiality agreement. 
  
  Remember to exercise caution and use your judgment when disclosing sensitive information.` },
];

const MergeBlogWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main; 
  const medium = palette.neutral.medium;
  const blue = palette.primary.dark;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setOpenDialog(true);
    setSelectedItem(item);
  };

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
          <ListItem key={index} component="a" href={post.url} sx={{ paddingY: '4px' }} onClick={() => handleItemClick(post)}>
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
          <ListItem key={index} component="a" href={faq.url} sx={{ paddingY: '4px' }} onClick={() => handleItemClick(faq)}>
            <ListItemIcon sx={{ minWidth: 'unset', marginRight: '4px' }}>
              <FiberManualRecordIcon sx={{ color: main, fontSize: 14 }} />
            </ListItemIcon>
            <ListItemText primary={faq.title} sx={{ color: blue, marginTop: '2px', marginBottom: '2px', marginLeft: '8px' }} />
          </ListItem>
        ))}
      </List>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedItem && selectedItem.title}</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <DialogContentText style={{ whiteSpace: 'pre-line'}}>
              {selectedItem.content}
            </DialogContentText>
          )}
        </DialogContent>
      </Dialog>
    </WidgetWrapper>
  );
};

export default MergeBlogWidget;
