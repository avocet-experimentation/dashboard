import PageSection from '#/components/helpers/PageSection';
import { HStack, Heading } from '@chakra-ui/react';
import { PageToolTip } from '#/components/helpers/PageToolTip';
import { HypothesisList } from './HypothesisList';
import { HypothesisCreationForm } from './HypothesisCreationForm';

/**
 * (WIP) Allow users to manage hypotheses
 *
 * todo:
 * - make form a modal
 * - make hypothesis list items manageable
 * - improve tooltip, form, and line item for clarity
 */
export default function HypothesesSection() {
  return (
    <PageSection>
      <HStack gap="2.5">
        <Heading size="lg">Hypotheses</Heading>
        <PageToolTip
          content={
            'At least one hypothesis must be defined before the experiment can be started.'
          }
        />
      </HStack>
      <HypothesisList />
      <HypothesisCreationForm />
    </PageSection>
  );
}
