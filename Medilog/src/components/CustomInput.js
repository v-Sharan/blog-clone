import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
  icon,
  mode,
  title,
  multiline,
  numberOfLines,
  editable,
  maxLength,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          {title && (
            <Text
              style={[
                styles.font,
                {
                  color: error ? "red" : "black",
                },
              ]}
            >
              {title}
            </Text>
          )}
          <View
            style={[
              styles.container,
              { borderColor: error ? "red" : "#e8e8e8" },
            ]}
          >
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              style={styles.input}
              secureTextEntry={secureTextEntry}
              inputMode={mode}
              multiline={multiline}
              numberOfLines={numberOfLines}
              editable={editable}
              maxLength={maxLength}
            />
            {icon}
          </View>
          {error && (
            <Text style={{ color: "red", alignSelf: "stretch" }}>
              {error.message || "Error"}
            </Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderRadius: 10,
    flex: 1,
  },
  font: {
    fontSize: 20,
    paddingVertical: 10,
  },
});

export default CustomInput;
