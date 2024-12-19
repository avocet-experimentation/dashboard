import ExperimentService from '#/services/ExperimentService';
import { useLocation, useRoute } from 'wouter';
import NotFound from '../../NotFound';
import { useEffect, useState } from 'react';
import {
  Box,
  EditableValueChangeDetails,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../../ui/menu';
import {
  EllipsisVertical,
  OctagonX,
  Power,
  Trash2,
} from 'lucide-react';
import { Experiment } from '@avocet/core';
import { Button } from '../../ui/button';
import VariationGroups from './VariationGroupsSection';
import LinkedFeatures from './LinkedFeaturesSection';
import ControlledEditable from '#/components/forms/ControlledEditable';
import { ExperimentDraft } from '@avocet/core';

const experimentService = new ExperimentService();

const experimentButtonProperties = (expStatus: string, expId: string) => {
  const active = expStatus === "active";
  const icon = active ? <OctagonX /> : <Power/>;
  const text = active ? "Stop Experiment" : "Start Experiment";
  const colorPalette = active ? "red" : "green";
  const onClick = active ? () => {} : () => experimentService.startExperiment(expId);
  return { icon, text, colorPalette, onClick };
}

const ExperimentPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [match, params] = useRoute('/experiments/:id');
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleGetExperiment = async () => {
      if (params) {
        try {
          const response = await experimentService.getExperiment(params.id);
          if (response.ok) {
            setExperiment(response.body);
          }
        } catch (error) {
          console.log(error);
        }
      }
      setIsLoading(false);
    };

    handleGetExperiment();
  }, []);

  const handleExperimentUpdate = async (
      updates: Partial<ExperimentDraft>,
    ): Promise<boolean> => {
      const response = await experimentService.updateExperiment(
        params.id,
        updates,
      );
  
      return response.ok;
    };

  const handleDeleteClick = async () => {
    if (!experiment) return;
    const response = await experimentService.delete(experiment.id);
    if (response.ok) {
      navigate('/experiments');
    } else {
      // todo: handle failed deletion
    }
  };

  if (isLoading) return <></>;

  if (experiment) {
    const expButtonProps = experimentButtonProperties(experiment.status, experiment.id);
    return (
      <Stack gap={4} padding="25px" height="100vh" overflowY="scroll">
        <Flex justifyContent="space-between">
          <Heading size="3xl">{experiment.name}</Heading>
          <HStack>
            <Button variant="solid" colorPalette={expButtonProps.colorPalette} onClick={expButtonProps.onClick}>
              {expButtonProps.icon}
              {expButtonProps.text}
            </Button>
            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton size="md">
                  <EllipsisVertical color="black" />
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem
                  value="delete"
                  valueText="Delete"
                  cursor="pointer"
                  color="fg.error"
                  _hover={{ bg: 'bg.error', color: 'fg.error' }}
                  onClick={handleDeleteClick}
                >
                  <Trash2 />
                  <Box flex="1">Delete</Box>
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          </HStack>
        </Flex>
        <Box>
          <Heading size="xl" marginBottom="15px">
            Overview
          </Heading>
          <Stack gap={4}>
            <ControlledEditable label="Description" initialValue={experiment.description ?? ''} 
              submitHandler={async (e: EditableValueChangeDetails) => {
                const success = await handleExperimentUpdate({
                  description: e.value,
                });
                return success ? e.value : (experiment.description ?? '');
              }}
            />
            <ControlledEditable label="Hypothesis" initialValue={experiment.description ?? ''} 
              submitHandler={async (e: EditableValueChangeDetails) => {
                const success = await handleExperimentUpdate({
                  hypothesis: e.value,
                }); 
                return success ? e.value : (experiment.hypothesis ?? '');
              }}
            />
          </Stack>
        </Box>
        <Box>
          <Heading size="xl" marginBottom="15px">
            Implementation
          </Heading>
          <Stack gap={4}>
            <VariationGroups experiment={experiment} />
            <Stack padding="15px" bg="white" borderRadius="5px">
              <Flex justifyContent="space-between">
                <Heading size="lg">
                  Linked Features ({experiment.flagIds.length})
                </Heading>
                {/* <FormModal
                  triggerButtonIcon={<Link />}
                  triggerButtonText={'Link Feature Flag'}
                  title={`Link Feature to ${experiment.name}`}
                  formId={LINK_FEATURE_FORM}
                  confirmButtonText={'Link'}
                >
                  <LinkFeatureForm
                    formId={LINK_FEATURE_FORM}
                    setIsLoading={undefined}
                  />
                </FormModal> */}
              </Flex>
              <LinkedFeatures experiment={experiment} />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    );
  } else {
    return <NotFound componentName={'experiment'} />;
  }
};

export default ExperimentPage;
