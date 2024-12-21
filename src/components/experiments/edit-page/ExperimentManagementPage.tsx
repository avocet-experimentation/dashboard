import { ServicesContext } from '#/services/ServiceContext';
import { useRoute } from 'wouter';
import NotFound from '../../NotFound';
import { useContext, useEffect, useState } from 'react';
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
import { EllipsisVertical, Link, Trash2 } from 'lucide-react';
import FormModal from '../../forms/FormModal';
import LinkFeatureForm from './LinkFeatureForm';
import { Experiment, ExperimentDraft } from '@avocet/core';
import VariationGroups from './VariationGroupsSection';
import ExperimentControlButton from './ExperimentControlButton';
import LinkedFeatures from './LinkedFeaturesSection';
import PageEditable from '#/components/forms/PageEditable';

const LINK_FEATURE_FORM = 'link-feature-form';

export default function ExperimentPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [match, params] = useRoute('/experiments/:id');
  const { experiment: experimentService } = useContext(ServicesContext);

  if (params === null) {
    throw new Error("Missing 'id' param!");
  }

  const handleExperimentUpdate = async (
    updates: Partial<ExperimentDraft>,
  ): Promise<boolean> => {
    const expResponse = await experimentService.updateExperiment(
      params.id,
      updates,
    );

    return expResponse.ok;
  };

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

  const handleDeleteFeature = () => {
    // experimentService.deleteExperiment(experiment.id);
    // navigate("/experiments");
  };

  if (isLoading) return <></>;

  if (experiment) {
    return (
      <Stack gap={4} padding="25px" overflowY="scroll">
        <Flex justifyContent="space-between">
          <Heading size="3xl">{experiment.name}</Heading>
          <HStack>
            <ExperimentControlButton
              experiment={experiment}
              experimentService={experimentService}
            />
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
                  onClick={handleDeleteFeature}
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
            <ControlledEditable
              label="Description"
              initialValue={experiment.description ?? ''}
              submitHandler={async (e: EditableValueChangeDetails) => {
                const success = await handleExperimentUpdate({
                  description: e.value,
                });
                return success ? e.value : (experiment.description ?? '');
              }}
            />
            <ControlledEditable
              label="Hypthesis"
              initialValue={experiment.hypothesis ?? ''}
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
}
