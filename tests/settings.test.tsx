// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { render, screen } from "@testing-library/react";
expect.extend(matchers);
import Settings from "../src/components/settings/settings";
import { LocalSettings } from '../utils/types';

const defaultSettings: LocalSettings = {
  apiKey: '',
  apiUrl: '',
  model: '',
  openRouterApiKey: '',
  openRouterApiUrl: '',
  openRouterModel: '',
};

describe('Settings component', () => {
  it('renders provider section', () => {
    render(
      <Settings
        open={true}
        onClose={() => {}}
        provider="local"
        error=""
        onChange={() => {}}
        localSettings={defaultSettings}
        setLocalSettings={() => {}}
      />
    );
    expect(screen.getByText('Provider')).toBeInTheDocument();
  });
});
