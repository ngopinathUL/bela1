'use client';

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteIcon from '@mui/icons-material/StickyNote2Outlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined';

const docs = [
  { name: 'IT-WORKS-ON-MY-MACHINE (2).jpg', size: '132.6 KB', date: 'Mar 12 2026', by: 'Deepa', hasNote: false },
  { name: 'IT-WORKS-ON-MY-MACHINE (1).jpg', size: '132.6 KB', date: 'Feb 12 2026', by: 'Fernando', hasNote: true },
  { name: 'IT-WORKS-ON-MY-MACHINE.jpg', size: '132.6 KB', date: 'Jan 29 2026', by: 'Fernando', hasNote: true },
];

const headerSx = {
  fontSize: 12,
  fontWeight: 600,
  color: '#666',
  fontFamily: 'Roboto Mono, monospace',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.36px',
  borderColor: '#EEEBE4',
} as const;

const cellSx = {
  fontSize: 14,
  color: '#262626',
  fontFamily: 'Roboto Flex, sans-serif',
  borderColor: '#EEEBE4',
  py: 2,
} as const;

export default function DocumentsTab() {
  return (
    <Box>
      {/* Document Uploads */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#fff' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DescriptionIcon sx={{ color: '#666', fontSize: 22 }} />
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#262626' }}>
              Document Uploads
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{
              borderColor: '#9A56FB',
              color: '#9A56FB',
              textTransform: 'none',
              fontFamily: 'Roboto Flex, sans-serif',
              fontWeight: 500,
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(154, 86, 251, 0.05)', borderColor: '#9A56FB' },
            }}
          >
            Upload Documents
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerSx}>Document Name</TableCell>
                <TableCell sx={headerSx}>Note</TableCell>
                <TableCell sx={headerSx}>Upload Date</TableCell>
                <TableCell sx={headerSx}>Uploaded By</TableCell>
                <TableCell sx={headerSx} align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {docs.map((doc, i) => (
                <TableRow key={i} hover>
                  <TableCell sx={cellSx}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <InsertDriveFileIcon sx={{ color: '#bbb', fontSize: 20 }} />
                      <div>
                        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{doc.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: '#999' }}>{doc.size}</Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell sx={cellSx}>
                    {doc.hasNote && <NoteIcon sx={{ color: '#9A56FB', fontSize: 20 }} />}
                  </TableCell>
                  <TableCell sx={cellSx}>{doc.date}</TableCell>
                  <TableCell sx={cellSx}>{doc.by}</TableCell>
                  <TableCell sx={cellSx} align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <IconButton size="small"><DownloadIcon sx={{ fontSize: 18, color: '#9A56FB' }} /></IconButton>
                      <IconButton size="small"><MoreHorizIcon sx={{ fontSize: 18, color: '#999' }} /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Deliverables */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: '#fff' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DescriptionIcon sx={{ color: '#666', fontSize: 22 }} />
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#262626' }}>
              Deliverables
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{
              borderColor: '#9A56FB',
              color: '#9A56FB',
              textTransform: 'none',
              fontFamily: 'Roboto Flex, sans-serif',
              fontWeight: 500,
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(154, 86, 251, 0.05)', borderColor: '#9A56FB' },
            }}
          >
            Upload Deliverables
          </Button>
        </Stack>

        <Box
          sx={{
            border: '1px dashed #ddd',
            borderRadius: 2,
            py: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#999',
          }}
        >
          <InsertDriveFileIcon sx={{ fontSize: 40, color: '#ccc', mb: 1 }} />
          <Typography sx={{ fontSize: 14, color: '#666', fontFamily: 'Roboto Flex, sans-serif' }}>
            <span style={{ color: '#9A56FB', textDecoration: 'underline', cursor: 'pointer' }}>Upload deliverables</span> to make them available to the customer.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
